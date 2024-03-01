import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentRole: localStorage.getItem('temp_role') || 'USER', 
  mainRole: localStorage.getItem('main_role') || 'USER' ,
  profileImage: 'https://i0.wp.com/vssmn.org/wp-content/uploads/2018/12/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png?fit=860%2C681&ssl=1',
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    setCurrentRole: (state, action) => {
      state.currentRole = action.payload;
      localStorage.setItem('temp_role', action.payload); // also update localStorage
    },
    setMainRole: (state, action) => {
        state.mainRole = action.payload;
        localStorage.setItem('main_role', action.payload);
      },
      setProfileImage: (state, action) => {
        state.profileImage = action.payload;
        localStorage.setItem('profile_image', action.payload);
      },
      setLogout: (state) => {
        
        state.profileImage = 'https://i0.wp.com/vssmn.org/wp-content/uploads/2018/12/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png?fit=860%2C681&ssl=1';
      },
  }
});

export const { setCurrentRole,setMainRole, setProfileImage,setLogout } = rolesSlice.actions;
export default rolesSlice.reducer;