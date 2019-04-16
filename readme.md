# Developed in: 2019

# Cardiff Assessment And Feedback Exchange
In 2018, Cardiff University launched the Way Forward Scheme: a programme which aims to improve the learning environment within the university. As part of this effort, the University's Students Union suggested a project which aims to improve the relationship between students and the feedback they receive from lecturers via their assessments.

The result was the CAFE App: Cardiff Assessment and Feedback Exchange Application.


---

## Login credentials for demo account
Username: guy@cardiff.ac.uk
Password: letmein

## How to run on local machine

### 1. Install nodejs and npm on your machine:
```bash
$ sudo apt-get install curl python-software-properties
$ curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
$ sudo apt-get update
$ sudo apt-get install nodejs
```

#### Verify node and npm are installed:
```bash
$ node -v
v10.15.3

$ npm -v
6.9.0
```

### 2. [Download](https://gitlab.cs.cf.ac.uk/c1616749/cardiff-assessment-and-feedback-exchange.git) or [Clone](https://gitlab.cs.cf.ac.uk/c1616749/cardiff-assessment-and-feedback-exchange.git) the repository to your local machine:
```bash
$ git clone https://gitlab.cs.cf.ac.uk/c1616749/cardiff-assessment-and-feedback-exchange.git
```
### 3. Run npm install (including client folder)
open a Command-Line inside the downloaded/cloned folder and run the following:

```
$ npm install
$ cd client
$ npm install
$ cd ..
$ npm run dev
```

### 3. Run the Application:

Go to [http://localhost:3000/](http://localhost:3000/login) In the url. 

---


### Testing
After any changes you can test if the application is running correctly by running the following command in the command-line:
```
$ npm test
```

If any of the tests failed that means the main code was affected with your changes, check your code again.

## Dependencies
This project uses a number of different dependencies which can all be installed using npm install
However if there are dependencies missing here is a list of the ones used:

- axios
- bcrypt
- body-parser
- concurrently
- express
- mongoose
- victory
- @fortawesome/fontawesome-svg-core
- @fortawesome/free-solid-svg-icons
- @fortawesome/react-fontawesome
- @trendmicro/react-sidenav
- antd
- bootstrap
- chart.js
- highcharts-react
- highcharts-react-official
- intro.js
- moment
- plotly.js
- prop-types
- react
- react-autobind
- react-bootstrap-table-next
- react-bootstrap-table2-editor
- react-bootstrap-table2-filter
- react-bootstrap-table2-paginator
- react-bootstrap-table2-toolkit
- react-chartkick
- react-dom
- react-minimal-pie-chart
- react-moment
- react-notifications
- react-notifications-component
- react-plotly.js
- react-pose
- react-router-dom
- react-scripts
- react-sidebar
- react-spring
- react-svg-piechart
- react-test-renderer
- react-toggle-switch
- reactstrap
- recharts
- sentiment
- speakeasy-nlp
- synonyms
- thesaurus-com

### Dev Dependencies

- @babel/cli
- @babel/core
- @babel/node
- @babel/preset-env
- @types/express
- nodemon
- enzyme
- enzyme-adapter-react-16
- prettier

### Resources page

The resources page is a complete list of resources in the application, this is something that will need to be maintained and updated by administrative staff.
Resources will need a name (String), skill (String), source (String), tags (Array of Strings), estimated completion time (Double), rate of recommendation (Double) and description(String).
When chosing a skill for a resource it is important to chose a broad hyponym which will act as a skill cateogry. The number of cateogry skills should be limited to allow for easier searchs, more conclusive analytics and to aid suggestions
made by the NLP pipeline. Good skill examples include those with large sematic field for example a student my need to work on their justification skills however a parent skill for this would be argument.

Resources are sorted in this order: module, skill, source, rate of recommendation.
Depending on the student thats logged in resources will be sorted in the order from the module they're doing worst in, till best.
Resources will then be sorted by skill in the order of the skill they are doing worst in till best.
Then by source, if any resources come from their school of education these will be ordered as a priotity over the rate of recommendation which is ordered from high to low.

I recommend the export function of the resources page be moved to an admin view as this is not a functionality for students.
I would also recommend giving lecturers the functionality to add resources too for their modules, this may have to go through admin approval however.

### NLP Pipeline

This works by finding synoyms of the user input, some of these synoyms may be keywords that exsist in the databse, the likelihood of this occuring is increased as these keywords are also hyponyms which have large sematic fields.
An external libraby is used for sentiment analysis.
This functionality has alot of potential but will need to change significantly to be fully optimal. If the input feedback page was updated to take large paragraphgs or documents
of feedback instead of granual sections this means the pipeline would need to change. If the paragrah mentions more than one skill lemmezation (sentence breakdown) and noun analysis (for subject identification)
and contextual analysis would need to occur to make the pipeline viable. With the feature of being able to pull feedback from a document or from learning central being advised this is a change I would consider making.


# Contributors
Kieran Burge<br>
Sohib Balkhy<br>
Jack Moffett<br>
Luke Barker<br>
Kabira Adebisi Suleman
