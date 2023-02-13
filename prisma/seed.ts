import user from './seed/user';
import category from './seed/category';
import article from './seed/article';
import comment from './seed/comment';
import reply from './seed/reply';

async function run() {
  await user();
  await article();
  await category();
  await comment();
  await reply();
}

run();
