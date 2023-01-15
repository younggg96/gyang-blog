import user from './seed/user';
import category from './seed/category';
import article from './seed/article';

async function run() {
  await user();
  await article();
  await category();
}

run();
