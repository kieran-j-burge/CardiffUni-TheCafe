import React from 'react';
import { shallow } from '../../enzyme';

import DropdownSkills from '../AddFeedback/DropdownSkills'

describe('Dropdown tests', () => {

    it('renders dropdown items', () => {
        const results = [{name: 'red1'},{name: 'red2'},{name: 'red3'}]
        const query = 'red1'

        const wrapper = shallow(<DropdownSkills results={results} query={query} />)

        expect(wrapper.find('.dropdown-suggestions')).toBeDefined()
        expect(wrapper.find('.dropdown-suggestions')).toHaveLength(1)

    })

    it('renders correct text in item', () => {
        const results = [{name: 'red1'},{name: 'red2'},{name: 'red3'}]
        const query = 'red1'

        const wrapper = shallow(<DropdownSkills results={results} query={query} />)
    
        //Expect the child of the first item to be an array
        expect(wrapper.find('li').get(0).props.children).toEqual('red1');
      });
})