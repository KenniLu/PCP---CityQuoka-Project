/* Empty Content Look Like this : 

{
    "root":
    {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children":
        [
            {
                "type": "paragraph",
                "format": "",
                "indent": 0,
                "version": 1,
                "children":
                [],
                "direction": null,
                "textStyle": "",
                "textFormat": 0
            }
        ],
        "direction": null
    }
}


*/

export const isRichTextEmpty = (richText) : boolean => {
  if(!richText || !richText.root){
    return true
  }

  if ( richText.root.children.length === 0 ){
    return true
  }

  return richText.root.children.every((child) => {
    return (child?.children||[]).length === 0
  })
}