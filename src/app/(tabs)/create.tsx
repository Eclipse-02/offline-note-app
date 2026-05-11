import { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';

import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import OfflineBanner from '@/components/OfflineBanner';
import useNetwork from '@/hooks/useNetwork';
import usePreferences from '@/hooks/usePreferences';
import { createNote } from '@/database/noteRepo';
import { EditorState } from '@/types/editor';

export default function CreateDetailScreen() {
    const insets = useSafeAreaInsets();
    const db = useSQLiteContext();
    const offline = useNetwork();
    const systemTheme = useColorScheme();
    const { appTheme } = usePreferences();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [inputHeight, setInputHeight] = useState(120);

    const [undoStack, setUndoStack] = useState<EditorState[]>([]);
    const [redoStack, setRedoStack] = useState<EditorState[]>([]);

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const lastSnapshot = useRef<EditorState>({
        title: '',
        content: '',
    });

    const isContent = title !== '' || content !== '';
    const resolvedTheme = appTheme === 'system' ? systemTheme : appTheme;

    const resetState = () => {
        setTitle('');
        setContent('');
        setUndoStack([]);
        setRedoStack([]);

        lastSnapshot.current = {
            title: '',
            content: '',
        };

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
    };

    const saveHistory = (newTitle: string, newContent: string) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            const previous = lastSnapshot.current;

            if (
                previous.title === newTitle &&
                previous.content === newContent
            ) {
                return;
            }

            setUndoStack(prev => [
                ...prev,
                previous,
            ]);

            setRedoStack([]);

            lastSnapshot.current = {
                title: newTitle,
                content: newContent,
            };
        }, 500);
    };

    const handleTitleChange = (text: string) => {
        saveHistory(text, content);
        setTitle(text);
    };

    const handleContentChange = (text: string) => {
        saveHistory(title, text);
        setContent(text);
    };

    const handleUndo = () => {
        if (undoStack.length === 0) return;

        const previous = undoStack[undoStack.length - 1];

        setRedoStack(prev => [
            ...prev,
            {
                title,
                content,
            },
        ]);

        setUndoStack(prev =>
            prev.slice(0, -1)
        );

        setTitle(previous.title);
        setContent(previous.content);

        lastSnapshot.current = previous;
    };

    const handleRedo = () => {
        if (redoStack.length === 0) return;

        const next = redoStack[redoStack.length - 1];

        setUndoStack(prev => [
            ...prev,
            {
                title,
                content,
            },
        ]);

        setRedoStack(prev =>
            prev.slice(0, -1)
        );

        setTitle(next.title);
        setContent(next.content);

        lastSnapshot.current = next;
    };

    const handleSave = async () => {
        if (!title.trim()) return;

        await createNote(title, content, db);
        resetState();
        router.back();
    };

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

            <View className="flex-row justify-between items-center px-4 pt-2">
                <TouchableOpacity
                    className="p-2"
                    onPress={() => {
                        resetState();
                        router.back()
                    }}
                >
                    <MaterialCommunityIcons
                        name="arrow-left-thin"
                        size={28}
                        color={resolvedTheme === 'dark' ? 'white' : 'black'}
                    />
                </TouchableOpacity>

                <View className="flex-row">
                    <TouchableOpacity
                        onPress={handleUndo}
                        disabled={undoStack.length === 0}
                        className="p-2 me-4"
                    >
                        <MaterialCommunityIcons
                            name="undo-variant"
                            size={24}
                            color={undoStack.length === 0
                                ? 'gray'
                                : (resolvedTheme === 'dark' ? 'white' : 'black')
                            }
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleRedo}
                        disabled={redoStack.length === 0}
                        className="p-2 me-4"
                    >
                        <MaterialCommunityIcons
                            name="redo-variant"
                            size={24}
                            color={redoStack.length === 0
                                ? 'gray'
                                : (resolvedTheme === 'dark' ? 'white' : 'black')
                            }
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={!isContent}
                        className="p-2"
                    >
                        <MaterialCommunityIcons
                            name="check"
                            size={24}
                            color={resolvedTheme === 'dark'
                                ? (isContent ? 'white' : 'gray')
                                : (isContent ? 'black' : 'gray')
                            }
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <TextInput
                    value={title}
                    onChangeText={handleTitleChange}
                    placeholder="Title"
                    className={`text-2xl mb-4
                        ${resolvedTheme === 'dark'
                            ? "bg-gray-900 text-white placeholder:text-gray-600"
                            : "bg-gray-100 text-black placeholder:text-gray-400"
                        }`}
                />

                <TextInput
                    value={content}
                    onChangeText={handleContentChange}
                    placeholder="Content"
                    multiline
                    textAlignVertical="top"
                    onContentSizeChange={(event) => {
                        setInputHeight(
                            event.nativeEvent.contentSize.height
                        );
                    }}
                    className={`rounded-2xl
                        ${resolvedTheme === 'dark'
                            ? "bg-gray-900 text-white placeholder:text-gray-600"
                            : "bg-gray-100 text-black placeholder:text-gray-400"
                        }`}
                    style={{ height: Math.max(120, inputHeight) }}
                />
            </ScrollView>
        </View>
    );
}
