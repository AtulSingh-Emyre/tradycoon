import {UserReportActionTypes} from '../../../redux/actions/TertiaryUserDetails/AnalystReportActions';

export interface IReport {
  totalSignal: number;
  freeSignal: number;
  paidSignal: number;
  activeSignal: number;
}
interface IStatus {
  error: boolean;
  loading: boolean;
  message: string;
}

export interface AnalystReportReducerState {
  analystReport: IReport;
  analystReportStatus: IStatus;
}
const initialstate: AnalystReportReducerState = {
  analystReport: {
    totalSignal: 0,
    freeSignal: 0,
    paidSignal: 0,
    activeSignal: 0,
  },

  analystReportStatus: {
    error: false,
    loading: false,
    message: '',
  },
};

export const AnalystReportReducer = (
  state = initialstate,
  action: any,
): AnalystReportReducerState => {
  switch (action.type) {
    // request reducer cases:
    case UserReportActionTypes.REPORT_ANALYST_DATA_REQUEST:
      return {
        ...state,
        analystReportStatus: {...state.analystReportStatus, loading: true},
      };
    // status reducer cases:
    case UserReportActionTypes.REPORT_ANALYST_DATA_STATUS:
      return {
        ...state,
        analystReportStatus: {...state.analystReportStatus,...action.payload},
      };

    // response reducer cases:
    case UserReportActionTypes.REPORT_ANALYST_DATA_RESPONSE:
      return {
        ...state,
        analystReport: {...action.payload},
        analystReportStatus: initialstate.analystReportStatus
      };
    default:
      return state;
  }
};
