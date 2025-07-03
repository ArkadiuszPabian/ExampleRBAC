export async function getMyInfoAction(request, response) {
  const token = request.token

  const myInfo = {
    id: token.sub,
    name: token.name,
    permissions: token.permissions,
  }

  response.status(200).send(myInfo)
}
