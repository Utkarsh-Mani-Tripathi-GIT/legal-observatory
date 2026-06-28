import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pbysrftircgrhchootwi.supabase.co',
  'sb_publishable_82IFFZwVhNsCWugtxbJmCg_AVMCStof'
);

async function main() {
  const { data: views, error: vError } = await supabase
    .from('page_views')
    .select('*');
    
  if (vError) console.error(vError);
  else {
    console.log('Views data:', views);
  }
}

main();
