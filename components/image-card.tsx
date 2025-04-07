import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Hit } from "@/types/api";
import { getImageSize, wp } from "@/helpers/common";
import { Image } from "expo-image";
import { theme } from "@/constants/theme";
import { Router } from "expo-router";

const ImageCard = ({
  router,
  item,
  index,
  column,
}: {
  item: Hit;
  index: number;
  column: number;
  router: Router;
}) => {
  const isLastInrow = () => (index + 1) % column === 0;

  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return { height: getImageSize(height, width) };
  };

  return (
    <Pressable
      style={[styles.imageWrapper, !isLastInrow() && styles.spacing]}
      onPress={() =>
        router.push({
          pathname: "/home/image",
          params: {
            previewURL: item.previewURL,
            webformatURL: item.webformatURL,
            imageWidth: item.imageWidth,
            imageHeight: item.imageHeight,
          },
        })
      }
    >
      <Image
        style={[styles.image, getImageHeight()]}
        source={{ uri: item.webformatURL }}
        transition={100}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: "100%",
  },

  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
    marginBottom: wp(2),
  },

  spacing: {
    marginRight: wp(2),
  },
});

export default ImageCard;
