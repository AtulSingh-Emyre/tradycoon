import CodePush from 'react-native-code-push';
import React, {useEffect} from 'react';

const CODE_PUSH_OPTIONS = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
};

const CodePushUpdater = (WrappedComponent: any) => {
  const WrappedApp = () => {
    useEffect(() => {
      CodePush.sync(
        {installMode: CodePush.InstallMode.IMMEDIATE},
        syncWithCodePush,
      );
    }, []);

    const syncWithCodePush = (status: any) => {
      console.log('Codepush sync status', status);
    };
   // return <WrappedComponent />;
  };

  return CodePush(CODE_PUSH_OPTIONS)(WrappedApp);
};
export default CodePushUpdater;
