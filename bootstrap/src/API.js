


export async function signIn(userInfo) {

  await Axios.post('signin', {user_email: userInfo}).then((res) => {
    if (res.status === 200) {
      console.log(res)
      return res.data;
    }
    return res.data;
  }).catch((err) => {
  });
}
