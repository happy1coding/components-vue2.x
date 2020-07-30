import { linkTo } from '@storybook/addon-links';
import HelloWord from '../components/HelloWorld';

export default {
  title: 'HelloWord',
};

export const toStorybook = () => ({
  components: { HelloWord },
  template: '<HelloWord />',
});
toStorybook.story = {
    name: 'HelloWord',   
};