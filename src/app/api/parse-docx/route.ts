import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

export async function GET() {
  try {
    const docxPath = '/Users/utkarshmanitri Tripathi/Documents/GitHub/NLO/Legal-Observatory.worktrees/agents-enhance-bhoomija-profile-design/RESEARCH PAPERS/Research Articles/The Weaponization of Human Rights.docx'.replace('utkarshmanitri Tripathi', 'utkarshmanitripathi');
    
    if (!fs.existsSync(docxPath)) {
      return NextResponse.json({ success: false, error: `File not found at ${docxPath}` });
    }

    const buffer = fs.readFileSync(docxPath);
    const zipFiles: Record<string, Buffer> = {};

    let offset = 0;
    while (offset < buffer.length - 30) {
      if (buffer.readUInt32LE(offset) === 0x04034b50) {
        const compressionMethod = buffer.readUInt16LE(offset + 8);
        const flags = buffer.readUInt16LE(offset + 6);
        let compressedSize = buffer.readUInt32LE(offset + 18);
        const fileNameLength = buffer.readUInt16LE(offset + 26);
        const extraFieldLength = buffer.readUInt16LE(offset + 28);
        
        const fileName = buffer.toString('utf8', offset + 30, offset + 30 + fileNameLength);
        const dataOffset = offset + 30 + fileNameLength + extraFieldLength;

        // Find the next signature to determine compressed block size if size in header is 0 (Descriptor bit 3 set)
        let entryEnd = dataOffset;
        while (entryEnd < buffer.length - 4) {
          const sig = buffer.readUInt32LE(entryEnd);
          if (sig === 0x04034b50 || sig === 0x02014b50 || sig === 0x06054b50) {
            break;
          }
          entryEnd++;
        }

        let compressedData = buffer.subarray(dataOffset, entryEnd);
        
        // Strip data descriptor if general purpose bit 3 is set
        if ((flags & 8) !== 0) {
          const descIndex = compressedData.indexOf(Buffer.from([0x50, 0x4b, 0x07, 0x08]));
          if (descIndex !== -1) {
            compressedData = compressedData.subarray(0, descIndex);
          } else if (compressedData.length > 12) {
            // Check if last 12 bytes look like a standard descriptor without signature
            compressedData = compressedData.subarray(0, compressedData.length - 12);
          }
        }

        let uncompressedData: Buffer;
        if (compressionMethod === 8) { // DEFLATE
          try {
            uncompressedData = zlib.inflateRawSync(compressedData);
          } catch (e: any) {
            // Fallback: try raw inflate without modifications
            try {
              uncompressedData = zlib.inflateRawSync(buffer.subarray(dataOffset, entryEnd));
            } catch (e2) {
              // Skip if it fails
              offset = dataOffset + compressedData.length;
              continue;
            }
          }
        } else {
          uncompressedData = compressedData;
        }

        zipFiles[fileName] = uncompressedData;
        offset = dataOffset + compressedData.length;
      } else {
        offset++;
      }
    }

    const docXmlBuffer = zipFiles['word/document.xml'];
    const relsXmlBuffer = zipFiles['word/_rels/document.xml.rels'];

    if (!docXmlBuffer) {
      return NextResponse.json({ 
        success: false, 
        error: 'Could not find or extract word/document.xml. Extracted files: ' + Object.keys(zipFiles).slice(0, 10).join(', ')
      });
    }

    const publicMediaDir = '/Users/utkarshmanitripathi/Documents/GitHub/NLO/Legal-Observatory.worktrees/agents-enhance-bhoomija-profile-design/public/images/weaponization';
    fs.mkdirSync(publicMediaDir, { recursive: true });

    // Write all media files to disk
    const extractedImages: string[] = [];
    Object.entries(zipFiles).forEach(([name, data]) => {
      if (name.startsWith('word/media/')) {
        const mediaName = path.basename(name);
        fs.writeFileSync(path.join(publicMediaDir, mediaName), data);
        extractedImages.push(mediaName);
      }
    });

    // Parse relationship mappings
    const relsMap: Record<string, string> = {};
    if (relsXmlBuffer) {
      const relsXml = relsXmlBuffer.toString('utf8');
      const relRegex = /<Relationship\s+[^>]*Id="([^"]+)"[^>]*Target="media\/([^"]+)"/g;
      let relMatch;
      while ((relMatch = relRegex.exec(relsXml)) !== null) {
        relsMap[relMatch[1]] = relMatch[2];
      }
    }

    const xmlText = docXmlBuffer.toString('utf8');

    // Extract paragraphs and check for text nodes and embedded images
    const paragraphs: string[] = [];
    const pRegex = /<w:p\b[^>]*>(.*?)<\/w:p>/g;
    const tRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/g;
    const embedRegex = /r:(?:embed|link)="([^"]+)"/g;
    
    let pMatch;
    while ((pMatch = pRegex.exec(xmlText)) !== null) {
      const pContent = pMatch[1];
      
      // Look for any embedded images inside this paragraph
      let paragraphMarkdown = '';
      let embedMatch;
      const seenImagesInP = new Set<string>();
      
      embedRegex.lastIndex = 0;
      while ((embedMatch = embedRegex.exec(pContent)) !== null) {
        const rId = embedMatch[1];
        const imageName = relsMap[rId];
        if (imageName && !seenImagesInP.has(imageName)) {
          seenImagesInP.add(imageName);
          paragraphMarkdown += `\n\n![Image](/images/weaponization/${imageName})\n\n`;
        }
      }

      // Extract text content of paragraph
      let pText = '';
      tRegex.lastIndex = 0;
      let tMatch;
      while ((tMatch = tRegex.exec(pContent)) !== null) {
        pText += tMatch[1];
      }
      
      const cleanText = pText
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .trim();

      if (cleanText) {
        paragraphMarkdown = cleanText + paragraphMarkdown;
      }

      if (paragraphMarkdown.trim()) {
        paragraphs.push(paragraphMarkdown.trim());
      }
    }

    // Generate markdown file
    let markdown = '';
    
    // Frontmatter
    markdown += `---\n`;
    markdown += `title: "The Weaponization of Human Rights"\n`;
    markdown += `subtitle: "How international human rights frameworks are co-opted for geopolitical dominance"\n`;
    markdown += `category: "research"\n`;
    markdown += `format: "Research Article"\n`;
    markdown += `author: "bhoomija-khanna"\n`;
    markdown += `date: "July 2026"\n`;
    markdown += `readTime: "25 min read"\n`;
    markdown += `coverImage: "/images/weaponization/image1.png"\n`; // Set cover to first image
    markdown += `---\n\n`;

    paragraphs.forEach((p, idx) => {
      const isShort = p.length < 120;
      const isAllCap = p.toUpperCase() === p && !p.startsWith('![Image]');
      const isHeadingIndicator = p.startsWith('Introduction') || p.startsWith('Conclusion') || p.includes('Section') || p.includes('CHAPTER');
      
      if (isShort && (isAllCap || idx === 0 || isHeadingIndicator) && !p.startsWith('![')) {
        markdown += `## ${p}\n\n`;
      } else {
        markdown += `${p}\n\n`;
      }
    });

    const outputPath = '/Users/utkarshmanitripathi/Documents/GitHub/NLO/Legal-Observatory.worktrees/agents-enhance-bhoomija-profile-design/content/research/the-weaponization-of-human-rights.md';
    fs.writeFileSync(outputPath, markdown, 'utf8');

    return NextResponse.json({ 
      success: true, 
      message: 'Article parsed and saved successfully with images!', 
      outputPath,
      paragraphCount: paragraphs.length,
      imageCount: extractedImages.length,
      imagesExtracted: extractedImages
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
