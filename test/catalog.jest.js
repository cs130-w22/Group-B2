const { updateTable, createTag } = require('../js/catalog.js');

test("Testing tag creation...", () => {
    const testTag = createTag('tagName', 'className', 'id');
    expect(testTag).toBeInstanceOf(Element);
    expect(testTag.tagName).toBe("TAGNAME");
    expect(testTag.className).toBe("className");
    expect(testTag.id).toBe("id");
})

test("Testing tag creation data-less...", () => {
    const testTag = createTag(null, null, null);
    expect(testTag).toBeInstanceOf(Element);
    expect(testTag.tagName).toBe("NULL");
    expect(testTag.className).toBe("");
    expect(testTag.id).toBe("");
})

test("Testing updating table...", () => {
    var tag = document.createElement('div');
    var testList = [];
    expect(updateTable(tag, testList)).toBe(undefined);
})