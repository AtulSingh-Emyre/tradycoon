//@Archive-Following related state
export enum ArchiveActionTypes {
  ARCHIVE_DATA_REQUEST = 'Archive data requested',
  ARCHIVE_DATA_RESPONSE = 'Archive data response',
  ARCHIVE_DATA_UPDATE_RESPONSE = 'archive data populated on load more',
  ARCHIVE_DATA_STATUS = 'Archive data status',
  SET_ARCHIVE_LOAD_MORE = 'setting load more state of archives',
  Archive_UPDATE_REQUEST = 'Archive update request',
  Archive_UPDATE_ERROR = 'archive changes did not save',
  Archive_UPDATE_RESPONSE = 'Archive update success',
  Archive_INITIALIZATION = 'Archive initializing',
  ARCHIVE_COUNT_UPDATE = 'Archive count update action',
  ARCHIVE_COUNT_INITIALIZE = 'Initialize the archive count'
}
export class ArchiveActions {
  static ArchiveInitializationAction = (Archives: any) => ({
    type: ArchiveActionTypes.Archive_INITIALIZATION,
    payload: {index: Archives},
  });
  static ArchiveCountUpdateAction = (num: number) => ({
    type: ArchiveActionTypes.ARCHIVE_COUNT_UPDATE,
    payload: num
  })
  
  static ArchiveCountInitializeAction = (num: number) => ({
    type: ArchiveActionTypes.ARCHIVE_COUNT_INITIALIZE,
    payload: num
  })
  static ArchiveSetLoadMoreStateAction = (state: boolean) => ({
    type: ArchiveActionTypes.SET_ARCHIVE_LOAD_MORE,
    payload: state,
  });
  static ArchiveIndexUpdateSuccessAction = () => ({
    type: ArchiveActionTypes.Archive_UPDATE_RESPONSE,
  });
  static ArchiveIndexRequestAction = () => ({
    type: ArchiveActionTypes.Archive_UPDATE_REQUEST,
  });
  static ArchiveIndexUpdateErrorAction = (
    error: boolean,
    loading: boolean,
    message: string,
  ) => ({
    type: ArchiveActionTypes.Archive_UPDATE_ERROR,
    payload: {
      error,
      loading,
      message,
    },
  });
  static ArchiveDataSuccessAction = (archives: any) => ({
    type: ArchiveActionTypes.ARCHIVE_DATA_RESPONSE,
    payload: archives,
  });
  static ArchiveDataUpdateSuccessAction = (archives: any) => ({
    type: ArchiveActionTypes.ARCHIVE_DATA_UPDATE_RESPONSE,
    payload: archives,
  });
  static ArchiveDataRequestAction = () => ({
    type: ArchiveActionTypes.ARCHIVE_DATA_REQUEST,
  });
  static ArchiveDataErrorAction = (
    error: boolean,
    loading: boolean,
    message: string,
  ) => ({
    type: ArchiveActionTypes.ARCHIVE_DATA_STATUS,
    payload: {
      error,
      loading,
      message,
    },
  });
}
