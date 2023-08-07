import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Chip, Colors} from 'react-native-paper';
export interface Props {
  chipItem: string[];
  onValueChange: any;
}
const ChipList = (props: Props) => {
  const [changeChipdata, setchangeChipItemdata] = useState<string[]>([]);
  const ValueChange = (item: string) => {
    if (changeChipdata.includes(item)) {
      setchangeChipItemdata(changeChipdata.filter(e => e !== item));
    } else {
      setchangeChipItemdata(changeChipdata => [...changeChipdata, item]);
    }
    props.onValueChange(changeChipdata);
  };
  return (
    <>
      {props.chipItem.map((item: any, index: number) => {
        return (
          <Chip
            mode="flat"
            selectedColor={
              changeChipdata.includes(item) ? Colors.white : Colors.black
            }
            style={[
              styles.chipItem,
              changeChipdata.includes(item)
                ? styles.selecrdchipbackcolor
                : styles.chipbackcolor,
            ]}
            icon={
              changeChipdata.includes(item)
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
ChipList.defaultProps = {};
export default ChipList;
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
