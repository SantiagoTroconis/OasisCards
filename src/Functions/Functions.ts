


export const getImageUrl = async (playerName: string): Promise<string> => {
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${playerName}`);
    const data = await response.json();
    return data?.player?.[0]?.strThumb || '';
}