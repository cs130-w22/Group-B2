import * as utils from '../js/utils.js'

test("Testing tag creation...", () => {
    const testTag = utils.createTag('tagName', 'className', 'id');
    expect(testTag).toBeInstanceOf(Element);
    expect(testTag.tagName).toBe("TAGNAME");
    expect(testTag.className).toBe("className");
    expect(testTag.id).toBe("id");
})

test("Testing tag creation data-less...", () => {
    const testTag = utils.createTag(null, null, null);
    expect(testTag).toBeInstanceOf(Element);
    expect(testTag.tagName).toBe("NULL");
    expect(testTag.className).toBe("");
    expect(testTag.id).toBe("");
})

test("Testing array append function...", () => {
    var testList = [1, 2, 3];
    const newList = utils.arrayAppend(testList, 4);
    expect(newList).toStrictEqual([1, 2, 3, 4]);
})

test("Testing array append function with null stuff...", () => {
    var testList = ["1", "2", "", "3"];
    const newList = utils.arrayAppend(testList, "4");
    expect(newList).toStrictEqual(["1", "2", "3", "4"]);
})