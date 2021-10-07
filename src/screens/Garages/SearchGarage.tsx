import { ScrollView, VStack } from 'native-base';
import React from 'react';
import Garage from './Garage';
import SearchBar from './SearchBar';

const SearchGarageScreen: React.FC = () => {
  return (
    <VStack>
      <SearchBar />
      <ScrollView px='5'>
        <Garage />
        <Garage />
        <Garage />
      </ScrollView>
    </VStack>
  );
};

export default SearchGarageScreen;
