// import React from 'react';
// import { configure, shallow } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// import renderer from 'react-test-renderer';
// import ModuleCard from './ModuleCard';
//
// configure({ adapter: new Adapter()});
// describe('<ModuleCard />', () => {
//     it("should render a Module Card with fundamental headings but no detail", () => {
//         const wrapper = shallow(<ModuleCard />);
//         expect(wrapper.find(ModuleCard));
//     });
// });
//
// it('renders correctly', () => {
//     const tree = renderer
//         .create(<ModuleCard />)
//         .toJSON();
//     expect(tree).toMatchSnapshot();
// });