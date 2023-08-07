import {UserGroupActionTypes} from '../../actions/user-groups/UserGroupActions';

export interface UserGroupReducerState {
  groups: any[];
  initializationStatus: {
    loading: boolean;
    error: boolean;
    message: string;
  };
  client: any[];
  clientStatus: {
    loading: boolean;
    error: boolean;
    message: string;
  };
  clientLoadMoreExists: boolean;
  clientLoadMoreIsLoading: boolean;
  status: {
    loading: boolean;
    error: boolean;
    status: number;
    message: string;
  };
}

const initialstate: UserGroupReducerState = {
  status: {
    error: false,
    loading: false,
    message: '',
    status: 200,
  },
  initializationStatus: {
    error: false,
    loading: false,
    message: '',
  },
  groups: [],
  client: [],
  clientLoadMoreExists: true,
  clientStatus: {
    error: false,
    loading: false,
    message: '',
  },
  clientLoadMoreIsLoading: false,
};

export const UserGroupReducer = (
  state = initialstate,
  action: any,
): UserGroupReducerState => {
  switch (action.type) {
    case UserGroupActionTypes.INITIALIZE_GROUPS_RESPONSE:
      return {
        ...state,
        groups: action.payload.groups,
        initializationStatus: initialstate.initializationStatus,
      };

    case UserGroupActionTypes.INITIALIZE_GROUPS_REQUEST_STATUS:
      return {
        ...state,
        initializationStatus: action.payload,
      };
    case UserGroupActionTypes.GET_USER_GROUP_CLIENT_LIST_RESPONSE:
      return {
        ...state,
        client: action.payload.atEnd
          ? [...state.client, ...action.payload.clients]
          : action.payload.clients,
        clientLoadMoreExists: action.payload.clients.length < 50 ? false : true,
        clientLoadMoreIsLoading: false,
        clientStatus: initialstate.clientStatus,
      };
    case UserGroupActionTypes.GET_USER_GROUP_CLIENT_LIST_REQUEST_STATUS:
      return {
        ...state,
        clientStatus: action.payload.status,
        clientLoadMoreIsLoading: action.payload.atEnd
          ? action.payload.status.loading
          : false,
      };
    case UserGroupActionTypes.ADD_GROUP:
      return {
        ...state,
        groups: [action.payload.group,...state.groups],
        status: initialstate.status,
      };
    case UserGroupActionTypes.ADD_USER_TO_GROUP:
      return {
        ...state,
        client: [ action.payload.user,...state.client],
        status: initialstate.status,
      };
    case UserGroupActionTypes.UPDATE_USER:
      return {
        ...state,
        client: state.client.map(item => {
          if (item._id == action.payload.id)
            item = {...item, ...action.payload.update};
          return item;
        }),
        status: initialstate.status,
      };
    case UserGroupActionTypes.RENAME_GROUP:
      return {
        ...state,
        groups: state.groups.map((item: any) => {
          if (item._id == action.payload.groupId) {
            item.groupName = action.payload.newGroupName;
          }
          return item;
        }),
        status: initialstate.status,
      };
    case UserGroupActionTypes.REMOVE_GROUP:
      return {
        ...state,
        groups: state.groups.filter((item: any) => {
          if (item._id == action.payload.groupId) return false;
          return true;
        }),
        status: initialstate.status,
      };
    case UserGroupActionTypes.REMOVE_USER_FROM_GROUP:
      return {
        ...state,
        status: initialstate.status,
        client: state.client.filter((item: any) => {
          if (item._id == action.payload) return false;
          return true;
        }),
      };
    case UserGroupActionTypes.SERVER_ERROR:
      return {
        ...state,
        status: action.payload.status,
      };
    default:
      return state;
  }
};
