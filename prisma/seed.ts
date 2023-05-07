import user from './seed/user';
import category from './seed/category';
import article from './seed/article';
import comment from './seed/comment';
import moments from './seed/moments';

async function run() {
  await user();
  await category();
  await article();
  await moments();
  await comment();
}

run();
