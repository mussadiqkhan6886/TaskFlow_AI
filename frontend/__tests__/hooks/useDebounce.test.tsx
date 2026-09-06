import useDebounce from "@/hooks/useDebounce"
import { act, renderHook } from "@testing-library/react"

describe("useDebounce custom hook", () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("shall return initial value immediately", () => {

    const {result} = renderHook(
        ({value}) => useDebounce(value),
        {
            initialProps:{
                value:"Hello"
            }
        }
    )

    expect(result.current)
        .toBe("Hello")

})

    it("shall update value after delay", () => {
        const {result, rerender} = renderHook(
            ({value}) => useDebounce(value),
            {
                initialProps: {
                    value: 'testing'
                }
            }
        )

        rerender({
            value: "testing two"
        })

        expect(result.current).toBe("testing")

        act(() => {
            vi.advanceTimersByTime(800)
        })

        expect(result.current).toBe("testing two")
    })

    it("shall not update before 800ms", () => {
        const {result, rerender} = renderHook(({value}) => useDebounce(value), 
        {
            initialProps: {
                value: "testing"
            }
        })

        rerender({
            value: "testing two"
        })

        
        act(() => {
            vi.advanceTimersByTime(500)
        })
        
        
        expect(result.current).toBe("testing")
    })

    it("should cancel previous timer when value changes", () => {
        const {result, rerender} = renderHook(({value}) => useDebounce(value), 
        {
            initialProps: {
                value: "testing"
            }
        })

        rerender({
            value: "testing two"
        })
        
        
        act(() => {
            vi.advanceTimersByTime(500)
        })
        
        rerender({
            value: "testing three"
        })

        act(() => {
            vi.advanceTimersByTime(800)
        })

        expect(result.current).toBe("testing three")
    })
})