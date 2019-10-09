import Vue from 'vue';
import Component from 'vue-class-component';
import { Subscription, Observable } from 'rxjs';

export default <State>(stream$: Observable<any>) => {
  @Component
  class StreamStateMixin extends Vue {
    state?: State | undefined;
    subscription?: Subscription | undefined;

    mounted() {
      this.subscription = stream$.subscribe((state: State) => {
        this.state = state;
      });
    }

    beforeDestroy() {
      this.subscription && this.subscription.unsubscribe();
    }
  }
  return StreamStateMixin;
};
