// import React from 'react';
// import { configure, shallow } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// import renderer from 'react-test-renderer';
// import ModuleCardMobile from './ModuleCardMobile';
//
// configure({ adapter: new Adapter()});
// describe('<ModuleCardMobile />', () => {
//     it("should render a collapsed Module Card with fundamental headings but no detail", () => {
//         const wrapper = shallow(<ModuleCardMobile />);
//         expect(wrapper.find(ModuleCardMobile));
//     });
// });
//
// it('renders correctly', () => {
//     const tree = renderer
//         .create(<ModuleCardMobile />)
//         .toJSON();
//     expect(tree).toMatchSnapshot();
// });