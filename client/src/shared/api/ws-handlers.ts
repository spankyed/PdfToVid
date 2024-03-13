export default {
  day_status: (setPapersList) => (status) => {
    const { key, status: current, data } = status;
    setPapersList((oldPapersList) => {
      const index = oldPapersList.findIndex(({ day }) => day.value === key);
      
      if (index === -1) {
        console.error("Day not found", key);
        return oldPapersList;
      }

      const newPapersList = [...oldPapersList];
      newPapersList[index].day.status = current;
      if (current === 'complete') {
        newPapersList[index].papers = data;
      }

      return newPapersList;
    });
  },

}
