#include<stdio.h>

void squares(int v) {
  for (int i=1;i<v+1;i++) {
    printf("%d ", i*i);
  }
  printf("\n");
}

int main() {
  squares(10);
}
