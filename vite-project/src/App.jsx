
import './App.css'
import Signup from './users/components/Signup'
import Home from './users/components/Home'
import { Router,Route,Routes} from 'react-router-dom'

import Login from './users/components/Login'
import Otp from './users/components/Otp'
import ResendOtp from './users/pages/ResendOtp';
import Nav from './users/components/Nav'
import Careers from './users/pages/Careers'
import PrivateRoute from './Routes/PrivateRoute'
import PublicRoute from './Routes/PublicRoute'
import Faculty_dashboard from './Faculties/Pages/Faculty_dashboard'
import Faculty_course_management from './Faculties/Pages/Faculty_course_management'
import Admin_dashboard from './Admin/pages/Admin_dashboard'
import Faculty_Testseries from './Faculties/Pages/Faculty_Testseries'
import Admin_course_management from './Admin/pages/Admin_course_management'
import Admin_career from './Admin/pages/Admin_career'
import CoursesList from './users/components/CoursesList'
// import CourseDetail from './users/components/CourseDetail'
import Admin_user_management from './Admin/pages/Admin_user_management';
// import {useNavigate} from 'react-router-dom'
// import { useSelector} from 'react-redux'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store,{persistor} from './Redux/Store'

import Admin_faculty from './Admin/pages/Admin_faculty';

import CourseDetailsView from './users/pages/CourseDetailsView';
// import Discussion from './users/pages/Discussions';
import Discussion_page from './users/pages/Discussion_page';
import Family_list from './users/pages/Family_list';

import QuizPage from './users/pages/QuizPage';
import QuizList from './users/pages/QuizList';
import QuizAnswerkey from './users/pages/QuizAnswerkey';
import Profile from './users/pages/Profile';
import SavedQuestions from './users/pages/SavedQuestions';
import ChatComponent from './users/pages/ChatComponent';
import GroupCall from './users/pages/GroupCall';
import NotesList from './users/pages/NotesList';
import NotesView from './users/pages/NotesView';
import PurchasedCourse from './users/pages/PurchasedCourse';
import NotAvailabepage from './users/pages/NotAvailabepage'



function App() {
  
  return (
    <>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    {/* <RoleDirector /> */}
    <Nav />
    <Routes>
        <Route path='/' element ={<Home />}/>
        {/* <Route path='/quizstart/:id' element ={<QuizPage />}/> */}

        {<Route path='/quizstart/:id' element={<PrivateRoute />}>
        <Route index element={<QuizPage />} />
        </Route>}

        {<Route path='/discussion_page' element={<PrivateRoute />}>
        <Route index element={<Discussion_page />} />
        </Route>}

        {<Route path='/group-chat' element={<PrivateRoute />}>
        <Route index element={<ChatComponent />} />
        </Route>}
      
        <Route path='/answerkey/:id/' element ={<QuizAnswerkey />}/>
        
        {<Route path='/signup' element={<PublicRoute />}>
        <Route index element={<Signup />} />
        </Route>}

        {<Route path='/resend_otp' element={<PublicRoute />}>
        <Route index element={<ResendOtp />} />
        </Route>}
        
        {<Route path='/login' element={<PublicRoute />}>
        <Route index element={<Login />} />
        </Route>}

        {<Route path='/otp' element={<PublicRoute />}>
        <Route index element={<Otp />} />
        </Route>}

        {<Route path='/profile' element={<PrivateRoute />}>
        <Route index element={<Profile />} />
        </Route>}

        {<Route path='/courses' element={<PrivateRoute />}>
        <Route index element={<CoursesList />} />
        </Route>}

        {<Route path='/notes' element={<PrivateRoute />}>
        <Route index element={<NotesList />} />
        </Route>}

        {<Route path='/purchased-courses' element={<PrivateRoute />}>
        <Route index element={<PurchasedCourse />} />
        </Route>}

        {<Route path='/family' element={<PrivateRoute />}>
        <Route index element={<Family_list />} />
        </Route>}

        {<Route path='/saved-questions' element={<PrivateRoute />}>
        <Route index element={<SavedQuestions />} />
        </Route>}

        {<Route path='/Quizlist' element={<PrivateRoute />}>
        <Route index element={<QuizList />} />
        </Route>}

        {<Route path="/chapters/:id" element={<PrivateRoute />}>
        <Route index element={<CourseDetailsView />} />
        </Route>}

        {<Route path="/faculty-testseries" element={<PrivateRoute />}>
        <Route index element={<Faculty_Testseries />} />
        </Route>}

        {<Route path="/faculty-testseries" element={<PrivateRoute />}>
        <Route index element={<Faculty_Testseries />} />
        </Route>}

        {<Route path="/notes-views/:uniqueChapterTitle" element={<PrivateRoute />}>
        <Route index element={<NotesView />} />
        </Route>}

        <Route path='/call' element ={<GroupCall />}/>
        <Route path='/faculty-dash' element ={<Faculty_dashboard />}/>
        <Route path='/faculty-course-manage' element ={<Faculty_course_management />}/>
        <Route path='/faculty-testseries' element ={<Faculty_Testseries />}/>
        
              
        <Route path='/admin-dash' element ={<Admin_dashboard />}/>
        <Route path='/admin-courses-manage' element ={<Admin_course_management />}/>
        <Route path='/admin-courses-requests' element ={<Admin_career />}/>
        <Route path='/admin-user-manage' element ={<Admin_user_management />}/>
        <Route path='/admin-faculties' element ={<Admin_faculty />}/>
        
        <Route path='/careers' element ={<Careers />}/>
        <Route path='*' element ={<NotAvailabepage />}/>

    </Routes>
    
    </PersistGate>
    </Provider>
    </>
    
  )
}

export default App
