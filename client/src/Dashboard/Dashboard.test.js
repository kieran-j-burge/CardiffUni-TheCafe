// import React from 'react';
// import { configure, shallow } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// import renderer from 'react-test-renderer';
// import Dashboard from './Dashboard';
//
// configure({ adapter: new Adapter()});
// describe('<Dashboard />', () => {
//     it("should render a Dashboard", () => {
//         const wrapper = shallow(<Dashboard />);
//         expect(wrapper.find(Dashboard));
//     });
// });
//
// it('renders correctly', () => {
//     const tree = renderer
//         .create(<Dashboard />)
//         .toJSON();
//     expect(tree).toMatchSnapshot();
// });