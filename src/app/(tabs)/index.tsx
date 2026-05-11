import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, useColorScheme } from 'react-native';

import { format } from 'date-fns';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from '@expo/vector-icons/Octicons';

import { Note } from '@/types/note';
import useNetwork from '@/hooks/useNetwork';
import usePreferences from '@/hooks/usePreferences';
import OfflineBanner from '@/components/OfflineBanner';
import { CARD_THEMES } from '@/constants/cardThemes';
import { deleteNote, getNotes, searchNotes } from '@/database/noteRepo';
import { getQueue, isNoteQueued, processQueue } from '@/services/syncQueue';

export default function Index() {
  const {
    cardTheme,
    setCardTheme,
    fontSize,
    setFontSize,
    appTheme,
    setAppTheme
  } = usePreferences();

  const offline = useNetwork();
  const db = useSQLiteContext();
  const insets = useSafeAreaInsets();
  const systemTheme = useColorScheme();

  const [notes, setNotes] = useState<Note[]>([]);
  const [queue, setQueue] = useState(getQueue());
  const [search, setSearch] = useState('');
  const hasMounted = useRef(false);

  const resolvedTheme = appTheme === 'system' ? systemTheme : appTheme;

  const theme = cardTheme === 'system'
    ? resolvedTheme === 'dark'
      ? { border: '#1f2937', background: '#000' }
      : { border: '#e5e7eb', background: '#fff' }
    : CARD_THEMES[cardTheme as keyof typeof CARD_THEMES];

  const loadNotes = async () => {
    const data = await getNotes(db);
    setNotes(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  const handleSearch = async (text: string) => {
    setSearch(text);

    if (!text.trim()) {
      loadNotes();
      return;
    }

    const result = await searchNotes(text, db);
    setNotes(result);
  };

  const handleDelete = async (id: string) => {
    await deleteNote(Number(id), db);
    loadNotes();
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (!offline) {
      processQueue();
      setQueue(getQueue());
    }
  }, [offline, notes]);

  const renderItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/detail/[id]',
          params: { id: item.id },
        })
      }
      className="p-4 rounded-2xl mb-3 border"
      style={{
        borderColor: theme?.border,
        backgroundColor: theme?.background,
      }}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1 pr-3">
          <Text
            className={`text-lg font-bold
              ${resolvedTheme === 'dark'
                ? "text-gray-200"
                : "text-gray-800"
              }`}
            style={{ fontSize: fontSize + 4 }}
          >
            {item.title}
          </Text>

          <Text
            numberOfLines={2}
            className={`mt-1 
              ${resolvedTheme === 'dark'
                ? "text-gray-300"
                : "text-gray-500"
              }`}
            style={{ fontSize }}
          >
            {item.content}
          </Text>

          <Text className="text-xs text-gray-400 mt-2">
            {format(new Date(item.updated_at), 'MMM dd yyyy HH:mm')} | {isNoteQueued(Number(item.id)) ? 'Not synced' : 'Synced'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          className="px-3 py-2"
        >
          <MaterialCommunityIcons name="trash-can-outline" size={28} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      className={`flex-1
        ${resolvedTheme === 'dark'
          ? "bg-gray-900"
          : "bg-gray-100"
        }`}
      style={{ paddingTop: insets.top }}
    >
      <OfflineBanner offline={offline} />

      <View className="px-4 pt-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className={`text-3xl font-bold
              ${resolvedTheme === 'dark'
                ? "text-gray-100"
                : "text-gray-800"
              }`}
          >
            My Notes
          </Text>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setAppTheme('system')}
              className={`px-2 py-2 rounded-xl border
                ${resolvedTheme === 'dark'
                  ? "bg-black border-gray-800"
                  : "bg-white border-gray-200"
                }`}
            >
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={24}
                color={resolvedTheme === 'dark' ? "white" : "black"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAppTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className={`px-2 py-2 rounded-xl border
                ${resolvedTheme === 'dark'
                  ? "bg-black border-gray-800"
                  : "bg-white border-gray-200"
                }`}
            >
              {resolvedTheme === 'dark'
                ? <Octicons name="moon" size={24} color="white" />
                : <Octicons name="sun" size={24} color="black" />}
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          placeholder="Search notes..."
          value={search}
          onChangeText={handleSearch}
          className={`border p-4 rounded-2xl placeholder:text-gray-500
            ${resolvedTheme === 'dark'
              ? "bg-black text-white border-gray-800"
              : "bg-white text-black border-gray-200"
            }`}
        />

        <View className="flex-row justify-between gap-3 mt-4">
          <View className="flex-row">

            <TouchableOpacity
              onPress={() => setCardTheme('system')}
              className={`w-10 h-10 mr-2 rounded-full border-2
                  ${resolvedTheme === 'dark' ? "bg-black" : "bg-white"}
                  ${cardTheme === 'system'
                  ? (resolvedTheme === 'dark' ? "border-white" : "border-black")
                  : (resolvedTheme === 'dark' ? "border-black" : "border-white")
                }`}
            />

            {Object.entries(CARD_THEMES)
              .filter(([key]) => key !== 'system')
              .map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  onPress={() =>
                    setCardTheme(key)
                  }
                  className={`w-10 h-10 mr-2 rounded-full border-2 
                    ${cardTheme === key
                      ? (resolvedTheme === 'dark' ? "border-white" : "border-black")
                      : (resolvedTheme === 'dark' ? "border-black" : "border-white")
                    }`}
                  style={{ backgroundColor: value!.border }}
                />
              ))}
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setFontSize(Math.max(fontSize - 2, 12))}
              className={`px-4 py-2 rounded-xl border
                ${resolvedTheme === 'dark'
                  ? "bg-black border-gray-800"
                  : "bg-white border-gray-200"
                }`}
            >
              <MaterialCommunityIcons
                name="format-annotation-minus"
                size={18}
                color={resolvedTheme === 'dark' ? "white" : "black"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFontSize(Math.min(fontSize + 2, 32))}
              className={`px-4 py-2 rounded-xl border
                ${resolvedTheme === 'dark'
                  ? "bg-black border-gray-800"
                  : "bg-white border-gray-200"
                }`}
            >
              <MaterialCommunityIcons
                name="format-annotation-plus"
                size={18}
                color={resolvedTheme === 'dark' ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {notes.length === 0 ? (
        <View className="flex-column justify-center items-center gap-3 py-4 mt-2">
          <MaterialCommunityIcons name="notebook-outline" size={48} color="orange" />
          <Text
            className={`text-2xlfont-semibold
              ${resolvedTheme === 'dark'
                ? "text-white"
                : "text-black"
              }`}
          >
            You don't have any notes yet
          </Text>
          <TouchableOpacity onPress={() => router.push('/create')}>
            <Text
              className={`text-xl font-semibold
                ${resolvedTheme === 'dark'
                  ? "text-yellow-600"
                  : "text-yellow-400"
                }`}
            >
              Make one
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        onPress={() => router.push('/create')}
        className={`absolute bottom-6 right-6 w-16 h-16 rounded-full items-center justify-center shadow-lg
          ${resolvedTheme === 'dark'
            ? "bg-yellow-600"
            : "bg-yellow-400"
          }`}
      >
        <Text className="text-white text-3xl font-bold">
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </Text>
      </TouchableOpacity>

    </View>
  );
}
