async function getPurchaseOrder(urlParams) {
  const ENDPOINT = `${urlParams.get('api')}?poId=${urlParams.get('poId')}`;
  const PARAMS = {
    headers: {
      'x-api-key': urlParams.get('key'),
    },
  }
  try {
    const response = await (await fetch(ENDPOINT, PARAMS)).json();
    return response.statusCode === 200 ? response.body : [];
  } catch (error) {
    console.log(error);
  }
}

export default getPurchaseOrder;

