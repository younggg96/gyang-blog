import user from './seed/user';
import category from './seed/category';
import article from './seed/article';
import comment from './seed/comment';
import reply from './seed/reply';
import moments from './seed/moments';

async function run() {
  await user();
  await article();
  await moments();
  await category();
  await comment();
  await reply();
}

run();
