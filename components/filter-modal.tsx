import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { Dispatch, SetStateAction, useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitalizeWords, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import SectionView, { ColorFilterRow, CommonFilterRow } from "./section-view";
import { data } from "@/constants/data";

interface Props {
  modalRef: React.RefObject<BottomSheetModal>;
  filters: Record<string, string | null> | null;
  setFilters: Dispatch<SetStateAction<Record<string, string | null> | null>>;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

const FilterModal = ({
  modalRef,
  filters,
  setFilters,
  onClose,
  onApply,
  onReset,
}: Props) => {
  const snapPoints = useMemo(() => ["75%"], []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={Custombackdrop}
      // onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(sections).map((sectionName, index) => {
            let sectionView = sections[sectionName as keyof typeof sections];
            let sectionData =
              data.filters[sectionName as keyof typeof data.filters];

            let title = capitalizeWords(sectionName);
            return (
              <View key={index}>
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: sectionName,
                  })}
                />
              </View>
            );
          })}

          {/* Actions */}
          <View style={styles.buttons}>
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.neutral(0.9) },
                ]}
              >
                Reset
              </Text>
            </Pressable>

            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>
                Apply
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

export interface ContentProps {
  data: string[];
  filters: Record<string, string | null> | null;
  setFilters: Dispatch<SetStateAction<Record<string, string | null> | null>>;
  filterName: string;
}

const sections: Record<string, React.FC<ContentProps>> = {
  order: (props) => <CommonFilterRow {...props} />,
  orientation: (props) => <CommonFilterRow {...props} />,
  type: (props) => <CommonFilterRow {...props} />,
  colors: (props) => <ColorFilterRow {...props} />,
};

const Custombackdrop = ({
  animatedIndex,
}: {
  animatedIndex: Animated.SharedValue<number>;
}) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  const containerStyle = [
    StyleSheet.absoluteFill,
    styles.overlay,
    containerAnimatedStyle,
  ];

  return (
    <Animated.View style={containerStyle}>
      <BlurView
        experimentalBlurMethod="dimezisBlurView"
        style={StyleSheet.absoluteFill}
        intensity={25}
        tint="dark"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  content: {
    flex: 1,
    // width: "100%",
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },

  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.05),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.grayBG,
  },

  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
  },

  buttonText: {
    fontSize: hp(2.2),
  },
});

export default FilterModal;
