import {ArchiveActionTypes} from '../../actions/TertiaryUserDetails/ArchiveActions';
export interface ArchiveReducerState {
  Archives: any;
  updateArchiveStatus: {
    loading: boolean;
    error: boolean;
    message: string;
  };
  ArchiveCount : number;
  getArchiveDataStatus: {
    loading: boolean;
    error: boolean;
    message: string;
  };
  archiveLoadMore: boolean;
}
const initialstate: ArchiveReducerState = {
  Archives: [],
  ArchiveCount: 0,
  updateArchiveStatus: {
    loading: false,
    error: false,
    message: '',
  },
  getArchiveDataStatus: {
    loading: false,
    error: false,
    message: '',
  },
  archiveLoadMore: true,
};

export const ArchiveReducer = (
  state = initialstate,
  action: any,
): ArchiveReducerState => {
  switch (action.type) {
    case ArchiveActionTypes.Archive_UPDATE_RESPONSE:
      return {
        ...state,
        archiveLoadMore: true,
        updateArchiveStatus: {
          error: false,
          loading: false,
          message: '',
        },
      };
    case ArchiveActionTypes.SET_ARCHIVE_LOAD_MORE: {
      state.archiveLoadMore = action.payload;
      return state;
    }
    case ArchiveActionTypes.ARCHIVE_DATA_UPDATE_RESPONSE: {
      return {
        ...state,
        Archives: [...state.Archives, ...action.payload],
        archiveLoadMore: action.payload.length == 0 ? false : true,
      };
    }
    case ArchiveActionTypes.ARCHIVE_COUNT_UPDATE: {
      return {
        ...state,
        ArchiveCount: state.ArchiveCount + action.payload
      }
    }
    case ArchiveActionTypes.ARCHIVE_COUNT_INITIALIZE: {
      return {
        ...state,
        ArchiveCount:action.payload
      }
    }
    case ArchiveActionTypes.Archive_UPDATE_ERROR:
      return {
        ...state,
        updateArchiveStatus: action.payload,
      };
    case ArchiveActionTypes.Archive_UPDATE_REQUEST:
      return {
        ...state,
        updateArchiveStatus: {error: false, loading: true, message: ''},
      };
    case ArchiveActionTypes.Archive_INITIALIZATION:
      return {
        ...state
      };
    case ArchiveActionTypes.ARCHIVE_DATA_REQUEST:
      return {
        ...state,
        getArchiveDataStatus: {error: false, loading: true, message: ''},
      };
    case ArchiveActionTypes.ARCHIVE_DATA_RESPONSE:
      return {
        ...state,
        getArchiveDataStatus: initialstate.getArchiveDataStatus,
        Archives: action.payload,
      };
    case ArchiveActionTypes.ARCHIVE_DATA_STATUS:
      return {
        ...state,
        getArchiveDataStatus: action.payload,
      };
    default:
      return state;
  }
};
