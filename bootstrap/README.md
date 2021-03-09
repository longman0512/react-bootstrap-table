# lazy loading layer logic
1. when you get the data from server, you have to set the 'downloading' flag as true to show the loading layer using setDownloading(true)
2. when you got the all data from server, you have to set the 'downloading' flag as false to disappear the loading layer using setDownloading(false)
3. when you toggle the 'downloading' flag in each page "Main.js" and "Update.js", 

{
    downloading?<div style={styles.loadingContainer}><CircularProgress style={{zIndex: 201, color: "white"}}/></div>:null
}

above part is one to shwo the lazy loading layer

# logic of the background yellow and text-color red when the data is modified
1. when user update the data, in the update.js file, we trigge this: socketClient.emit("Edit",{data: data, update_filed: temp}) //// 81 line of "Update.js"
2. if the above function is triggered, server cattches this event on the 40 line of the "server.js"
3. After that, in "editData" function, server updates the db data, and emit updated data to all other users on 159 and 160 lines of "server.js" file.
4. Then on 38 line of "Main.js" and 32 line of "Update.js" file, all the users get the modified data from the server.
4.1 In the 'Main.js' file, all the modified rows are saved in 'modiList' variable which is determined on 30 line of "Main.js" file,
4.2 the "tableComponent.js" file get the 'modiList' variable as props.modiList.
4.3 For the rows style, the 'rowStyle' function is determined on 35 line of the 'TableComponent.js', you have to reference below links to understand rowStyle and columstyle of 'react-bootstrap-table'

---row style
https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Work%20on%20Rows&selectedStory=Customize%20Row%20Style&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel

---column style
https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Work%20on%20Columns&selectedStory=Customize%20Column%20Style&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel

4.4 when user click the updated row(its background-color is yellow), 'rowEvents' is determined on 101 line of the "TableComponent.js". for this please reference this url

https://react-bootstrap-table.github.io/react-bootstrap-table2/storybook/index.html?selectedKind=Work%20on%20Rows&selectedStory=Row%20Event&full=0&addons=1&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel

4.5 if user click the updated row, app trigger the 'props.readModify(row)' to remove the modified list from the 'modiList' variable of the parent "Main.js"

That's all

* For the toggle, Now I am using the cogoToast,
If you need to show the toggle, 
you have to import it in any page.
import cogoToast from 'cogo-toast';

afte that you can use it anywhere like this
cogoToast.success(modify.msg, {hideAfter: 12});
for the full reference, Please check this url
https://github.com/Cogoport/cogo-toast
