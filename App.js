import React, {useState, useCallback, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  TextInput,
  StatusBar,
} from 'react-native';
import storage from './storage';
import apiFactory from '@sammacbeth/dat-api-v1';

const defaultAddress =
  '41f8a987cfeba80a037e51cc8357d513b62514de36f2f9b3d3eeec7a8fb3b5a5';

// create an API using file persistence
const api = apiFactory({
  persistantStorageFactory: address =>
    Promise.resolve(file => storage('hyperdrive')(`${address}/${file}`)),
});

const load = async address => {
  // create a dat and work with it's hyperdrive
  const dat = await api.createDat({persist: true});
  await dat.ready;
  console.log('Created a Dat at address', dat.drive.key.toString('hex'));
  dat.drive.writeFile('file.txt', Buffer.from('hello world', 'utf8'), () =>
    console.log('wrote some data into the dat!'),
  );
  // join and leave the network
  dat.joinSwarm();
  dat.leaveSwarm();

  // load an existing dat in memory
  const existing = await api.getDat(address, {
    persist: false,
    driveOptions: {
      sparse: true,
    },
  });

  // wait for data
  await new Promise(async (resolve, reject) => {
    setTimeout(reject.bind(null, 'timeout'), 5000);
    await existing.ready;
    resolve();
  });

  const files = await new Promise((resolve, reject) => {
    existing.drive.readdir('/', (err, files) => {
      if (err) {
        return reject('error listing directory');
      }
      resolve(files);
    });
  });

  // close all dats and cleanup
  api.shutdown();

  return files;
};

const App = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [address, setAddress] = useState(defaultAddress);
  const inputRef = useRef();
  const loadCallback = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const newFiles = await load(address);
      setFiles(newFiles);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  }, [address]);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.wrapper}>
          <View style={styles.topBar}>
            <TextInput
              ref={inputRef}
              editable
              style={styles.input}
              defaultValue={defaultAddress}
              placeholder="Enter DAT address"
              placeholderTextColor="#666666"
              autoCorrect={false}
              autoCompleteType="off"
              autoCapitalize="none"
              onChangeText={setAddress}
            />
            <Button onPress={loadCallback} style={styles.button} title="load" />
          </View>
          <ScrollView style={styles.scrollView}>
            <View style={styles.content}>
              {error ? (
                <Text>Error: {error}</Text>
              ) : (
                <>
                  {loading ? (
                    <Text>Loading...</Text>
                  ) : (
                    <>
                      {files.length > 0 && (
                        <View>
                          <Text>List of files:</Text>
                          {files.map(file => (
                            <Text key={file}>{file}</Text>
                          ))}
                        </View>
                      )}
                    </>
                  )}
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  wrapper: {
    flexGrow: 1,
    flexDirection: 'column',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    width: '70%',
    flexGrow: 1,
    padding: 5,
    marginLeft: 10,
    backgroundColor: '#cccccc',
  },
  button: {},
  scrollView: {
    flexGrow: 1,
  },
  content: {
    margin: 10,
  },
});

export default App;
