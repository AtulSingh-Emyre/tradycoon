import {Dimensions} from 'react-native';
const width = Dimensions.get('screen').width;

export const gStyles = {
  container: {paddingHorizontal: 10},
  safeAreaView: {
    flex: 1,
  },
  loaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  litItemMain: {
    width: '50%',
    alignItems: 'center',
    marginTop: 10,
  },
  listImageStyle: {
    height: width * 0.4,
    width: width * 0.4,
    borderRadius: 10,
  },
  listTextStyle: {
    width: width * 0.4,
    marginTop: 3,
    fontSize: 12,
  },
};
export const gPadding = {
  padding0: {
    padding: 0,
  },
  padding15: {
    padding: 15,
  },
};
export const gMargin = {
  margin10: {
    margin: 10,
  },
  margin15: {
    margin: 15,
  },
};
export const gMarginHorizontal = {
  margin10: {
    marginHorizontal: 10,
  },
  margin15: {
    marginHorizontal: 15,
  },
};
export const Gwidth = {
  width10: {
    width: '10%',
  },
  width18: {
    width: '18%',
  },
  width20: {
    width: '20%',
  },
  width25: {
    width: '25%',
  },
  width30: {
    width: '30%',
  },
  width32: {
    width: '32%',
  },
  width38: {
    width: '38%',
  },
  width40: {
    width: '40%',
  },
  width48: {
    width: '48%',
  },
  width50: {
    width: '50%',
  },
  width55: {
    width: '55%',
  },
  width60: {
    width: '60%',
  },
  width70: {
    width: '70%',
  },
  width75: {
    width: '75%',
  },
  width80: {
    width: '80%',
  },
  width90: {
    width: '90%',
  },
  width100: {
    width: '100%',
  },
};
