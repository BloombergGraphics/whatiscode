      PROGRAM SQUARES
     
      CALL SQUARE(10)
      END

      SUBROUTINE SQUARE(N)
      SUM = 1
      DO 10 I = 1, N
         WRITE (*,'(I10,$)') (I*I)
 10   CONTINUE
      PRINT *, ""
      END
