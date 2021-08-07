
import {
  createReducer,
  on,
  Action,
} from '@ngrx/store';
// import {User} from '../model/user.model';
import { TabActions } from '@/app/actions/action-types';
import { ITabState } from '@/app/reducers/interfaces';


export const initialTabState: ITabState = {
  tab: 'ngl',
};

const tabReducer = createReducer(

    initialTabState,

    on(TabActions.setTab, (state: ITabState, { tab }) => {

      console.log('set tab', tab);
      const next = { ...state };
      next.tab = tab;
      return next;

    }),

);

export function TabReducer(state: ITabState | undefined, action: Action) {

  return tabReducer(state, action);

}
