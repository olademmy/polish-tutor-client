import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useSpeechSynthesis } from 'react-speech-kit';
import TextToSpeech from '../textToSpeech/TextToSpeech';
import { ChakraProvider } from '@chakra-ui/react';
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';

import './Notes.css';

const Notes = ({ columns, setColumns }) => {
  const location = useLocation();
  const { item } = location.state;
  const [dataToRender, setDataToRender] = useState(item);
  const [stringToTranslate, setStringToTranslate] = useState({ english: '' });
  const [translatedString, setTranslatedString] = useState({ polish: '' });
  const [transEngPlPlEnd, setTransEngPlPlEnd] = useState('');
  const { voices } = useSpeechSynthesis();
  const [sourceTarget, setSourceTarget] = useState(
    '"source":"en","target":"pl"'
  );

  const axios = require('axios');

  useEffect(() => {
    axios
      .get(`http://localhost:8000/position`)
      .then(function (response) {
        setColumns(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleChangeTextField = (event) => {
    const { name, value } = event.target;

    setDataToRender({
      ...dataToRender,
      [name]: value,
    });
  };

  const postToDb = () => {
    axios
      .post(`http://localhost:8000/position`, columns)
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (columns.D?.items) {
      const itemsArray = columns.D.items;

      itemsArray.forEach((el, index) => {
        if (el.id === item.id) itemsArray[index] = dataToRender;
      });

      postToDb();
    }

    setStringToTranslate({ english: '' });
    setTranslatedString({ polish: '' });
  };

  const handleTranslation = (event) => {
    event.preventDefault();

    if (stringToTranslate.english) {
      const options = {
        method: 'POST',
        url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': process.env.REACT_APP_X_RapidAPI_Key,
          'X-RapidAPI-Host': process.env.REACT_APP_X_RapidAPI_Host,
        },

        data: `{"q":"${stringToTranslate.english}",${transEngPlPlEnd}}`,
      };

      axios
        .request(options)
        .then(function (response) {
          console.log(response.data.data.translations.translatedText);
          setTranslatedString({
            polish: response.data.data.translations.translatedText,
          });
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  };

  const handleChangeTranslationField = (event) => {
    const { name, value } = event.target;
    setStringToTranslate({ ...stringToTranslate, [name]: value });
  };

  const handleTranslationLanguage = (value) => {
    setSourceTarget(value);
    setTransEngPlPlEnd(sourceTarget);
  };

  return (
    <>
      <ChakraProvider>
        <div className='notes-wrapper'>
          <Box w='100%' h='200px' p={4} mb='25px' mt='5px'>
            <Tabs isFitted variant='soft-rounded'>
              <TabList mb='1em'>
                <Tab>Present </Tab>
                <Tab>Past </Tab>
                <Tab>Future Imperfect</Tab>
                <Tab>Future</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className='table-wrapper-present'>
                    <table>
                      <tbody>
                        <tr>
                          <td>{dataToRender.word_image.english_word}</td>
                          <td>{dataToRender.present.present_ja}</td>
                          <td>{dataToRender.present.present_ty}</td>
                          <td>{dataToRender.present.present_on_ona_ono}</td>
                          <td>{dataToRender.present.present_my}</td>
                          <td>{dataToRender.present.present_wy}</td>
                          <td>{dataToRender.present.present_oni_one}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className='table-wrapper-past'>
                    <table>
                      <tbody>
                        <tr>
                          <td className='masculine'>
                            {dataToRender.past.past_ja_masc}
                          </td>
                          <td className='masculine-alt'>
                            {dataToRender.past.past_ty_masc}
                          </td>
                          <td className='masculine'>
                            {dataToRender.past.past_on_masc}
                          </td>
                          <td className='masculine-alt'>
                            {dataToRender.past.past_my_masc}
                          </td>
                          <td className='masculine'>
                            {dataToRender.past.past_wy_masc}
                          </td>
                          <td className='masculine-alt'>
                            {dataToRender.past.past_oni_masc}
                          </td>
                        </tr>
                        <tr>
                          <td className='feminine'>
                            {dataToRender.past.past_ja_fem}
                          </td>
                          <td className='feminine-alt'>
                            {dataToRender.past.past_ty_fem}
                          </td>
                          <td className='feminine'>
                            {dataToRender.past.past_ona_fem}
                          </td>
                          <td className='feminine'>
                            {dataToRender.past.past_my_fem}
                          </td>
                          <td className='feminine-alt'>
                            {dataToRender.past.past_wy_fem}
                          </td>
                          <td className='feminine'>
                            {dataToRender.past.past_one_fem}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className='table-wrapper-future-imperfect'>
                    <table>
                      <tbody>
                        <tr>
                          <td>{dataToRender.imp_future.imp_future_ja}</td>
                          <td>{dataToRender.imp_future.imp_future_ty}</td>
                          <td>
                            {dataToRender.imp_future.imp_future_on_ona_ono}
                          </td>
                          <td>{dataToRender.imp_future.imp_future_my}</td>
                          <td>{dataToRender.imp_future.imp_future_wy}</td>
                          <td>{dataToRender.imp_future.imp_future_oni_one}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className='table-wrapper-future'>
                    <table>
                      <tbody>
                        <tr>
                          <td className='masculine'>
                            {dataToRender.future_masc.future_masc_ja}
                          </td>
                          <td className='masculine-alt'>
                            {dataToRender.future_masc.future_masc_ty}
                          </td>
                          <td className='masculine'>
                            {dataToRender.future_masc.future_masc_on}
                          </td>
                          <td className='masculine-alt'>
                            {dataToRender.future_masc.future_masc_my}
                          </td>
                          <td className='masculine'>
                            {dataToRender.future_masc.future_masc_wy}
                          </td>
                          <td className='masculine-alt'>
                            {dataToRender.future_masc.future_masc_oni}
                          </td>
                        </tr>
                        <tr>
                          <td className='feminine'>
                            {dataToRender.future_fem.future_fem_ja}
                          </td>

                          <td className='feminine-alt'>
                            {dataToRender.future_fem.future_fem_ty}
                          </td>
                          <td className='feminine'>
                            {dataToRender.future_fem.future_fem_ona}
                          </td>

                          <td className='feminine-alt'>
                            {dataToRender.future_fem.future_fem_my}
                          </td>

                          <td className='feminine'>
                            {dataToRender.future_fem.future_fem_wy}
                          </td>

                          <td className='feminine-alt'>
                            {dataToRender.future_fem.future_fem_one}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          <div className='user-notes-input'>
            <form>
              <div className='translation'>
                <div className='card-button-wrapper'>
                  <div className='card-image'>
                    {dataToRender.word_image.image_url && (
                      <img
                        src={dataToRender.word_image.image_url}
                        alt='img'
                        height='150'
                        width='125'
                      />
                    )}
                  </div>
                </div>

                <div className='text-to-translate'>
                  <textarea
                    onChange={handleChangeTranslationField}
                    placeholder='Tekst do przetłumaczenia'
                    name='english'
                    value={stringToTranslate.english}
                  ></textarea>
                </div>

                <div className='translation-radio-buttons'>
                  <RadioGroup onChange={handleTranslationLanguage}>
                    <Stack direction='row'>
                      <Radio
                        id='eng-pl'
                        name='translation'
                        value={'"source":"pl","target":"en"'}
                      >
                        English - Polish
                      </Radio>
                      <Radio
                        id='pl-eng'
                        name='translation'
                        value={'"source":"en","target":"pl"'}
                      >
                        Polish - English
                      </Radio>
                    </Stack>
                  </RadioGroup>

                  <div className='translation-button'>
                    <Button
                      colorScheme='blue'
                      border={'2px solid black'}
                      size='sm'
                      onClick={handleTranslation}
                    >
                      Translate
                    </Button>
                  </div>
                </div>

                <div className='translated-text'>
                  <textarea
                    placeholder='Przetłumaczony tekst'
                    defaultValue={translatedString.polish}
                  ></textarea>
                </div>
              </div>

              <textarea
                className='user-notes'
                id='notes'
                name='notes'
                rows='4'
                cols='25'
                value={dataToRender.notes}
                onChange={handleChangeTextField}
              >
                {dataToRender.notes}
              </textarea>
              <div className='update-notes-play-voice'>
                <Button
                  className='btn--update-notes'
                  id='submit-verb-button'
                  type='submit'
                  onClick={handleSubmit}
                >
                  Update notes
                </Button>
                <div className='text-to-speech'>
                  <TextToSpeech data={dataToRender.notes} voices={voices} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </ChakraProvider>
    </>
  );
};

export default Notes;
