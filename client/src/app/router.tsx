import { GuestGuard } from "./guards/guest-guard";
import { TeacherGuard } from "./guards/teacher-guard";
import { StudentGuard } from "./guards/student-guard";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from './layouts/auth-layout'
import ROUTES from "./routes";
import LoginForm from "@/features/authorizarion/login-form";
import AppLayout from "./layouts/app-layout";
import RegistratinForm from "@/features/registration/registration-form";
import Homepage from "@/app/homepage";
import CourseEditPage from "@/features/course-edit/course-edit-page";
import TopicEditPage from "@/features/topic-edit/topic-edit-page";
import CoursePreviewPage from "@/features/course-preview/course-preview-page";
import EnrollmentManagePage from "@/features/enrollment-manage/enrollment-manage-page";
import { AuthGuard } from "./guards/auth-guard";
import CourseStatisticsPage from "@/features/course-statistics/course-statistics-page";
import TopicPassingPage from "@/features/topic-passing/topic-passing-page";


export default function Router() {
    return (
        <Routes>
            <Route element={<GuestGuard><AuthLayout /></GuestGuard>}>
                <Route path={ROUTES.loginPage} element={<LoginForm />}/>
                <Route path={ROUTES.registerPage} element={<RegistratinForm />} />
            </Route>


            <Route element={
                <AuthGuard>
                    <AppLayout />
                </AuthGuard>
            }>
                <Route path={ROUTES.homepage} element={
                    <StudentGuard>
                        <Homepage />
                    </StudentGuard>
                } />


                <Route path={ROUTES.courseEditPage(':courseID')} element={
                    <TeacherGuard>
                        <CourseEditPage/>
                    </TeacherGuard>
                } />

                <Route path={ROUTES.courseStaticticsPage(':courseID')} element={
                    <TeacherGuard>
                        <CourseStatisticsPage />
                    </TeacherGuard>
                }/>

                <Route path={ROUTES.coursePage(':courseID')} element={<CoursePreviewPage />} />


                <Route path={ROUTES.topicEditPage(':topicID')} element={
                    <TeacherGuard>
                        <TopicEditPage />
                    </TeacherGuard>
                } />
                
                <Route path={ROUTES.topicPassingPage(":topicID")} element={
                    <StudentGuard>
                        <TopicPassingPage />
                    </StudentGuard>
                } />


                <Route path={ROUTES.enrollmentPage(":enrollmentID")} element={
                    <StudentGuard>
                        <EnrollmentManagePage />
                    </StudentGuard>
                } />
            </Route>
            
            <Route path="*" element={<Navigate to={ROUTES.homepage} replace />} />
        </Routes>   
    )
}