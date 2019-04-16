import React from 'react';
import { shallow } from '../../enzyme';

import Dropdown from '../AddFeedback/DropdownSuggestions'

describe('Dropdown tests', () => {

    it('renders dropdown items', () => {
        const results = ['red1', 'red2', 'red3']
        const query = 'red1'

        const wrapper = shallow(<Dropdown results={results} query={query} />)

        expect(wrapper.find('.dropdown-suggestions')).toBeDefined()
        expect(wrapper.find('.dropdown-suggestions')).toHaveLength(1)

    })
    
    it('renders correct text in item', () => {
        const results = ['red1', 'red2', 'red3']
        const query = 'red1'

        const wrapper = shallow(<Dropdown results={results} query={query} />)
    
        //Expect the child of the first item to be an array
        expect(wrapper.find('li').get(0).props.children).toEqual('red1');
      });
    
})