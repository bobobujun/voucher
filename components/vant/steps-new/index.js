import { VantComponent } from '../common/component';
import { GREEN, GRAY_DARK,GRAY_DARKN} from '../common/color';
VantComponent({
  props: {
    icon: String,
    steps: Array,
    active: Number,
    direction: {
      type: String,
      value: 'horizontal'
    },
    activeColor: {
      type: String,
      value: GREEN
    },
    inactiveColor: {
      type: String,
      value: GRAY_DARKN
    },
    activeIcon: {
      type: String,
      value: 'checked'
    },
    inactiveIcon: String
  }
});
