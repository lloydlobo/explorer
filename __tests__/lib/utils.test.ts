import { API_BASE_URL } from "@/lib/constants";
import { cn, copyToClipboard, fetcher } from "@/lib/utils";

///////////////////////////////////////////////////////////////////////////////
// region_start: cn
///////////////////////////////////////////////////////////////////////////////

describe("cn utility function", () => {
  test("returns empty string when called with no arguments", () => {
    expect(cn()).toBe("");
  });

  test("returns a single class name when called with a string argument", () => {
    expect(cn("btn")).toBe("btn");
  });

  test("combines multiple class names when called with multiple string arguments", () => {
    expect(cn("btn", "btn-primary", "lg")).toBe("btn btn-primary lg");
  });

  test("ignores falsy values when called with a mix of truthy and falsy arguments", () => {
    expect(cn("btn", null, undefined, "btn-primary", "", 0, "lg", false)).toBe(
      "btn btn-primary lg"
    );
  });

  test("returns class names based on boolean values when called with an object argument", () => {
    const props = { btn: true, "btn-primary": false, lg: true };
    expect(cn(props)).toBe("btn lg");
  });

  test("combines multiple input types correctly", () => {
    expect(cn("btn", { "btn-primary": true, lg: false }, "lg")).toBe(
      "btn btn-primary lg"
    );
  });
});

///////////////////////////////////////////////////////////////////////////////
// region_end: cn
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// region_start: copyToClipboard
///////////////////////////////////////////////////////////////////////////////

describe("copyToClipboard", () => {
  const mockWriteText = jest.fn();

  beforeAll(() => {
    // Mock the clipboard API
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
    });
  });

  afterAll(() => {
    // Restore the original clipboard API
    Object.defineProperty(navigator, "clipboard", {
      value: global.navigator.clipboard,
      writable: true,
    });
  });

  describe("with successful writeText", () => {
    beforeEach(() => {
      mockWriteText.mockImplementation(() => Promise.resolve());
    });

    test("copies text to clipboard using Clipboard API", () => {
      const text = "Hello, world!";
      const onSuccess = jest.fn();
      const onError = jest.fn();

      copyToClipboard({ text, onSuccess, onError });

      expect(mockWriteText).toHaveBeenCalledWith(text);
      // mockWriteText function that is called in the implementation of copyToClipboard
      // is returning a promise that resolves immediately,
      // before the onSuccess callback has a chance to be called.
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    test("copies text to clipboard using Clipboard API async", async () => {
      const text = "Hello, world!";
      const onSuccess = jest.fn();
      const onError = jest.fn();

      const promise = copyToClipboard({ text, onSuccess, onError });

      expect(mockWriteText).toHaveBeenCalledWith(text);

      await promise;

      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });

    test("calls onSuccess if clipboard writeText succeeds", async () => {
      const text = "Hello, world!";
      const onSuccess = jest.fn();
      const onError = jest.fn();

      copyToClipboard({ text, onSuccess, onError });

      await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the promise to resolve/reject

      expect(mockWriteText).toHaveBeenCalledWith(text);
      expect(onSuccess).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe("with failed writeText", () => {
    beforeEach(() => {
      const error = new Error("Failed to write text to clipboard");
      mockWriteText.mockImplementation(() => Promise.reject(error));
    });

    test("calls onError if clipboard writeText fails", async () => {
      const text = "Hello, world!";
      const onSuccess = jest.fn();
      const onError = jest.fn();

      copyToClipboard({ text, onSuccess, onError });

      await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for the promise to resolve/reject

      expect(mockWriteText).toHaveBeenCalledWith(text);
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalled();
    });

    test("calls onError if clipboard writeText fails async", async () => {
      const text = "Hello, world!";
      const onSuccess = jest.fn();
      const onError = jest.fn();

      try {
        await copyToClipboard({ text, onSuccess, onError });
      } catch (err) {
        expect(mockWriteText).toHaveBeenCalledWith(text);
        expect(onSuccess).not.toHaveBeenCalled();
        expect(onError).toHaveBeenCalled();
      }
    });
  });
});

///////////////////////////////////////////////////////////////////////////////
// region_end: copyToClipboard
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// region_start: fetcher
///////////////////////////////////////////////////////////////////////////////

describe("fetcher", () => {
  const mockFetch = jest.fn();

  beforeAll(() => {
    global.fetch = mockFetch;
  });

  afterAll(() => {
    delete global.fetch; // FIX: The operand of a 'delete' operator must be optional.ts(2790) ⚠ Error(TS2790) |
  });

  describe("when the fetch request is successful", () => {
    test("fetches data from URL and returns JSON", async () => {
      const data = { foo: "bar" };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(data),
      });

      const url = `${API_BASE_URL}/alpha/USA`;
      const result = await fetcher({ url });

      expect(result).toEqual(data);
      expect(mockFetch).toHaveBeenCalledWith(url);
    });
  });

  describe("when the fetch request fails", () => {
    test("throws an error", async () => {
      const error = new Error("Failed to fetch data");
      mockFetch.mockRejectedValue(error);

      const url = `${API_BASE_URL}/alpha/USA`;
      await expect(fetcher({ url })).rejects.toThrow(
        new Error(`Failed to fetch data from ${url}: ${error.message}`)
      );
    });
  });

  describe("when the response is not valid JSON", () => {
    test("throws an error", async () => {
      const err = JSON.stringify({ invalid: "json" }, null, 2);
      const response = {
        ok: true,
        json: () => Promise.reject(err),
      };
      mockFetch.mockResolvedValue(response);

      const url = `${API_BASE_URL}/alpha/USA`;
      await expect(fetcher({ url })).rejects.toThrow(
        new Error(`Unexpected error while fetching data from ${url}: ${err}`)
      );
    });
  });

  describe("when the response status is not ok", () => {
    test("throws an error", async () => {
      const response = { ok: false, status: 404 };
      mockFetch.mockResolvedValue(response);

      const url = `${API_BASE_URL}/alpha/USA`;
      await expect(fetcher({ url })).rejects.toThrow(
        new Error(`Failed to fetch data from ${url}: HTTP error: 404`)
      );
    });
  });
});

// PERF: Test the fetcher function with different types of HTTP response statuses, such as 500 and 204 status codes, to ensure that it handles them correctly. This will help catch any issues that may arise when handling these types of responses.
// PERF: Test the fetcher function with unexpected or malformed JSON responses from the server to make sure that it can handle them properly. This will help identify any problems that may occur when dealing with malformed JSON data or structures.
// PERF: Verify that the fetcher function can correctly handle cases where the server response is empty or has missing or incomplete data fields. Test it with responses that have missing or incomplete data fields or with an empty response body.
// PERF: Check that the fetcher function can handle cases where the request URL is invalid or malformed. Test it with URLs that have invalid characters or are not properly encoded or with a URL that points to a non-existent resource on the server.
// PERF: Test the fetcher function under heavy load or with a server that has high latency to ensure that it can handle large responses or slow connections. This will help identify any issues that may occur when dealing with large or slow responses.

///////////////////////////////////////////////////////////////////////////////
// region_end: fetcher
///////////////////////////////////////////////////////////////////////////////
