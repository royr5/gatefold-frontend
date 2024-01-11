import { Text, View, Image, Pressable } from "react-native";
import { Music } from "../types/front-end";
import React, { useEffect, useState } from "react";
import { useGlobalSearchParams } from "expo-router";
import { getMusic } from "../utils/api";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

const AlbumPage = () => {
  const { music_id } = useGlobalSearchParams();
  const [musicContent, setMusicContent] = useState<Music>();
  const [ratingColor, setRatingColor] = useState("text-green-800");

  useEffect(() => {
    const doThis = async () => {
      const musicData = await getMusic(music_id as string, "true");
      setMusicContent(musicData);

      let score = parseInt(musicData?.avg_rating);
      if (score < 7 && score > 4) {
        setRatingColor("text-yellow-600");
      } else if (score <= 4) {
        setRatingColor("text-red-700");
      }
    };
    doThis();
  }, []);

  const playPreview = async () => {
    console.log("yo")
    console.log(musicContent?.preview)
    if (typeof musicContent?.preview === "string") {
      const sound = new Audio.Sound();

      console.log(sound)

      await sound.loadAsync(
        {
          uri: musicContent.preview,
        },
        { shouldPlay: true }
      );

      await sound.playAsync();
    }
  };

  return (
    <View className="bg-[#faf6ff] flex justify-center items-center">
      <Text className="text-center  text-xl font-bold my-3 ">
        {musicContent?.name}
      </Text>
      <Text>by</Text>
      <View className="flex-row mb-3">
        {musicContent?.artist_names.map((artistName) => {
          return (
            <Text
              key={artistName}
              className="text-center m-50 text-xl m-1 underline-offset-3 underline"
            >
              {artistName}
            </Text>
          );
        })}
      </View>

      <Image
        source={{ uri: musicContent?.album_img }}
        className="h-[350] w-[350] shadow-2xl rounded-md"
      />
      <Pressable onPress={playPreview}>
        <Ionicons name="play" size={30} color={"black"} />
      </Pressable>
      {!musicContent?.avg_rating && (
        <Text className="font-bold text-lg">no reviews yet...</Text>
      )}
      {musicContent?.avg_rating && (
        <Text className={`${ratingColor} font-bold text-lg m-2 shadow-2xl p-2`}>
          Rating: {musicContent?.avg_rating}
        </Text>
      )}
    </View>
  );
};

export default AlbumPage;
