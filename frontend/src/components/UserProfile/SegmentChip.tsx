import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Chip, Colors} from 'react-native-paper';
export interface Props {
  chipItem: string[];
  onValueChange: any;
}
const SegmentChip = (props: Props) => {
  const segmentData: string[] = [
    'Equities',
    'F & O',
    'Commodities',
    'Currency',
  ];
  // const [props.chipItem, setchangeChipItemdata] = useState<string[]>(
  //   props.chipItem,
  // );
  const ValueChange = (item: string) => {
    if (props.chipItem.includes(item)) {
      props.onValueChange(props.chipItem.filter(e => e !== item));
    } else {
      props.onValueChange([...props.chipItem,item])
    }
  };
  return (
    <>
      {segmentData.map((item: any, index: number) => {
        return (
          <Chip
            mode="flat"
            selectedColor={
              props.chipItem.includes(item) ? Colors.white : Colors.black
            }
            style={[
              styles.chipItem,
              props.chipItem.includes(item)
                ? styles.selecrdchipbackcolor
                : styles.chipbackcolor,
            ]}
            icon={
              props.chipItem.includes(item)
                ? 'checkbox-marked-circle'
                : 'checkbox-blank-circle'
            }
            key={index}
            onPress={() => {
              ValueChange(item);
            }}>
            {item}
          </Chip>
        );
      })}
    </>
  );
};
SegmentChip.defaultProps = {};
export default SegmentChip;
const styles = StyleSheet.create({
  chipItem: {
    marginHorizontal: 6,
    marginVertical: 6,
  },
  selecrdchipbackcolor: {
    backgroundColor: Colors.green500,
  },
  chipbackcolor: {
    backgroundColor: Colors.white,
  },
});
