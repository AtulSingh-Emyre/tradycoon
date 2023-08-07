//@Archive-Following related state
export enum UserReportActionTypes {
  REPORT_ANALYST_DATA_REQUEST = 'Analyst report data requested',
  REPORT_ANALYST_DATA_STATUS = 'Analyst report data status',
  REPORT_ANALYST_DATA_RESPONSE = 'Analyst report data server response',
}
export class UserReportActions {
  // response actions
  static getAnalystReportDataAction = (report: {
    totalSignal: number;
    freeSignal: number;
    paidSignal: number;
    activeSignal: number;
  }) => ({
    type: UserReportActionTypes.REPORT_ANALYST_DATA_RESPONSE,
    payload: report,
  });

  // Request Actions
  static getAnalystReportRequestAction = () => ({
    type: UserReportActionTypes.REPORT_ANALYST_DATA_REQUEST,
  });

  // status actions
  static analystReportStatusAction = (status: {
    error: boolean;
    loading: boolean;
    message: string;
  }) => ({
    type: UserReportActionTypes.REPORT_ANALYST_DATA_STATUS,
    payload: status,
  });
  // response actions
}
