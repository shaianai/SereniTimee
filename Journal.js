import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function JournalingScreen() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [isEditing, setEditing] = useState(false);

  const addDiaryEntry = () => {
    if (title.trim() && content.trim()) {
      setNotes([...notes, { title, content, date: new Date().toLocaleDateString() }]);
      setTitle('');
      setContent('');
      setModalVisible(false);
    } else {
      alert('Both title and content are required!');
    }
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    setNoteModalVisible(false);
  };

  const saveEdit = () => {
    const updatedNotes = [...notes];
    updatedNotes[selectedNote.index] = {
      ...selectedNote,
      title,
      content,
    };
    setNotes(updatedNotes);
    setNoteModalVisible(false);
    setEditing(false);
  };

  const openNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setNoteModalVisible(true);
  };

  return (
    <LinearGradient
      colors={['#0F4470', '#84A9C0']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Journal</Text>
      </View>

      {/* Notes List */}
      <FlatList
        data={notes}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => openNote({ ...item, index })}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDate}>{item.date}</Text>
              <Text style={styles.cardContent} numberOfLines={3}>
                {item.content}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.notesList}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            No journal entries yet. Add your first entry!
          </Text>
        }
      />

      {/* Add Entry Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={36} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Add Entry Modal */}
      <Modal visible={isModalVisible} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>New Journal Entry</Text>

                {/* Title Input */}
                <TextInput
                  style={styles.modalInput}
                  placeholder="Title"
                  placeholderTextColor="#A0B0C0"
                  value={title}
                  onChangeText={setTitle}
                />

                {/* Content Input */}
                <TextInput
                  style={styles.modalTextarea}
                  placeholder="Write about your day..."
                  placeholderTextColor="#A0B0C0"
                  value={content}
                  onChangeText={setContent}
                  multiline={true}
                />

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={addDiaryEntry}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Note Details Modal */}
      <Modal visible={isNoteModalVisible} animationType="fade" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setNoteModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.noteModalContent}>
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.modalInput}
                      value={title}
                      onChangeText={setTitle}
                    />
                    <TextInput
                      style={styles.modalTextarea}
                      value={content}
                      onChangeText={setContent}
                      multiline={true}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.noteTitle}>{selectedNote?.title}</Text>
                    <Text style={styles.noteDate}>{selectedNote?.date}</Text>
                    <Text style={styles.noteContent}>{selectedNote?.content}</Text>
                  </>
                )}

                {/* Delete Button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteNote(selectedNote?.index)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>

                {/* Edit Button */}
                {!isEditing && (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setEditing(true)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#0F4470',
    alignItems: 'center',
    elevation: 5,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#84A9C0',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F4470',
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 12,
    color: '#84A9C0',
    marginBottom: 10,
  },
  cardContent: {
    fontSize: 14,
    color: '#0F4470',
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 50,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#84A9C0',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F4470',
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: '#F4F7FA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    fontSize: 18,
    color: '#0F4470',
    borderWidth: 1,
    borderColor: '#84A9C0',
  },
  modalTextarea: {
    backgroundColor: '#F4F7FA',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#0F4470',
    borderWidth: 1,
    borderColor: '#84A9C0',
    height: 150,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#84A9C0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteModalContent: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  noteTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F4470',
    marginBottom: 10,
  },
  noteDate: {
    fontSize: 12,
    color: '#84A9C0',
    marginBottom: 20,
  },
  noteContent: {
    fontSize: 16,
    color: '#0F4470',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#84A9C0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
