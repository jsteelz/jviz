async function getJsonData(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    const message = `An error has occured while fetching json data: ${res.status}`;
    // throw new Error(message);
    console.log(message, url);

    return null;
  }

  const json = await res.json();
    
  return json;
}

export default getJsonData;