import Axios from 'axios';

export async function signIn(userInfo) {

  await Axios.post('signin', { user_email: userInfo }).then((res) => {
    if (res.status === 200) {
      console.log(res)
      return res.data;
    }
    return res.data;
  }).catch((err) => {
  });
}

export async function signUp(userInfo) {

  await Axios.post('signup', userInfo).then((res) => {
    if (res.status === 200) {
      console.log(res)
      return res;
    }
    return res;
  }).catch((err) => {
    return err
  });
}
