(defun squares (count)
  (dotimes (n count)
    (format t "~a " (* (+ n 1) (+ n 1)))))
(squares 10)


